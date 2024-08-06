package service

import (
	"auth-service/pkg/config"
	"auth-service/pkg/proxy"
	"fmt"
	"log"

	"github.com/go-chi/chi/v5"
	"github.com/patrickmn/go-cache"
)

func SetServices(r *chi.Mux, config *config.Config, cache *cache.Cache) {
	for serviceName, service := range config.Services {
		for _, route := range service.Routes {
			r.HandleFunc(fmt.Sprintf("/%s%s", serviceName, route.Path), proxy.HandlerFactory(serviceName, &route, config, cache))
			log.Printf("Added route: %s%s for service: %s", serviceName, route.Path, serviceName)
		}
	}
}
