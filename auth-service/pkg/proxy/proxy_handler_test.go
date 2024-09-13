package proxy

import (
	"auth-service/pkg/config"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/patrickmn/go-cache"
	"github.com/stretchr/testify/assert"
)

func TestExtractPathWithoutService(t *testing.T) {
	tests := []struct {
		name        string
		serviceName string
		path        string
		expected    string
	}{
		{
			name:        "Valid path with service",
			serviceName: "service1",
			path:        "/service1/api/v1/resource",
			expected:    "/api/v1/resource",
		},
		{
			name:        "Path with just service name",
			serviceName: "service1",
			path:        "/service1",
			expected:    "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := extractPathWithoutService(tt.serviceName, tt.path)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestIsRateLimited(t *testing.T) {
	tests := []struct {
		name              string
		cacheItems        map[string]int
		serviceName       string
		remoteAddr        string
		rateLimitCount    int
		rateLimitWindow   time.Duration
		expectedRateLimit bool
	}{
		{
			name:              "Not rate limited - first request",
			cacheItems:        nil,
			serviceName:       "service1",
			remoteAddr:        "192.168.0.1",
			rateLimitCount:    3,
			rateLimitWindow:   1 * time.Minute,
			expectedRateLimit: false,
		},
		{
			name: "Rate limited - request count exceeds limit",
			cacheItems: map[string]int{
				"service1-192.168.0.1": 3,
			},
			serviceName:       "service1",
			remoteAddr:        "192.168.0.1",
			rateLimitCount:    3,
			rateLimitWindow:   1 * time.Minute,
			expectedRateLimit: true,
		},
		{
			name: "Not rate limited - request count below limit",
			cacheItems: map[string]int{
				"service1-192.168.0.1": 2,
			},
			serviceName:       "service1",
			remoteAddr:        "192.168.0.1",
			rateLimitCount:    3,
			rateLimitWindow:   1 * time.Minute,
			expectedRateLimit: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := cache.New(5*time.Minute, 10*time.Minute)

			for k, v := range tt.cacheItems {
				c.Set(k, v, cache.DefaultExpiration)
			}

			result := isRateLimited(tt.serviceName, tt.remoteAddr, tt.rateLimitWindow, tt.rateLimitCount, c)
			assert.Equal(t, tt.expectedRateLimit, result)
		})
	}
}

func mockConfig(serverUrl string) *config.Config {
	return &config.Config{
		Services: map[string]config.Service{
			"service1": {
				URL: serverUrl,
			},
		},
		RateLimitTimeWindow: 1 * time.Minute,
		RateLimitCount:      3,
	}
}

func mockServer() *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}))
}

func TestProxyRequestWithMockServer(t *testing.T) {
	tests := []struct {
		name           string
		serviceName    string
		remoteAddr     string
		path           string
		cacheItems     map[string]int
		expectedStatus int
	}{
		{
			name:           "Successful proxy request",
			serviceName:    "service1",
			remoteAddr:     "192.168.0.1",
			path:           "/service1/api/v1/resource",
			cacheItems:     nil,
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Start the mock server
			server := mockServer()
			defer server.Close()

			// Create a config that points to the mock server's URL
			cfg := mockConfig(server.URL)

			c := cache.New(5*time.Minute, 10*time.Minute)

			// Preload the cache with any existing items
			for k, v := range tt.cacheItems {
				c.Set(k, v, cache.DefaultExpiration)
			}

			w := httptest.NewRecorder()
			req := httptest.NewRequest("GET", tt.path, nil)
			req.RemoteAddr = tt.remoteAddr

			ProxyRequest(w, req, tt.serviceName, cfg, c)
			resp := w.Result()

			assert.Equal(t, tt.expectedStatus, resp.StatusCode)
		})
	}
}

func TestHandlerFactory(t *testing.T) {
	tests := []struct {
		name           string
		serviceName    string
		remoteAddr     string
		path           string
		cacheItems     map[string]int
		expectedStatus int
	}{
		{
			name:           "Unauthorized request - skipping auth logic",
			serviceName:    "service1",
			remoteAddr:     "192.168.0.1",
			path:           "/service1/api/v1/resource",
			cacheItems:     nil,
			expectedStatus: http.StatusOK,
		},
		{
			name:        "Rate limit exceeded",
			serviceName: "service1",
			remoteAddr:  "192.168.0.1",
			path:        "/service1/api/v1/resource",
			cacheItems: map[string]int{
				"service1-192.168.0.1": 3,
			},
			expectedStatus: http.StatusTooManyRequests,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := cache.New(5*time.Minute, 10*time.Minute)
			server := mockServer()
			defer server.Close()
			cfg := mockConfig(server.URL)

			// Preload the cache with any existing items
			for k, v := range tt.cacheItems {
				c.Set(k, v, cache.DefaultExpiration)
			}

			handler := HandlerFactory(tt.serviceName, cfg, c)

			w := httptest.NewRecorder()
			req := httptest.NewRequest("GET", tt.path, nil)
			req.RemoteAddr = tt.remoteAddr

			handler(w, req)
			resp := w.Result()

			assert.Equal(t, tt.expectedStatus, resp.StatusCode)
		})
	}
}
