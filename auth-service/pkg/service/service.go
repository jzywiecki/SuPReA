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
	for serviceName := range config.Services {
		r.Mount(fmt.Sprintf("/%s", serviceName), proxy.HandlerFactory(serviceName, config, cache))
		log.Printf("Added route: %s for service: %s", serviceName, serviceName)
	}
}
