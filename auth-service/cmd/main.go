package main

import (
	"auth-service/pkg/auth"
	"auth-service/pkg/config"
	"auth-service/pkg/database"
	"auth-service/pkg/service"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/patrickmn/go-cache"
)

func main() {
	r := chi.NewRouter()

	_ = r

	database.ConnectDBClient()

	config, err := config.LoadConfig("config", "yaml", ".")

	if err != nil {
		log.Fatalf("error in reading configuration.")
	}

	cache := cache.New(config.RateLimitTimeWindow, time.Minute*10)

	r.Post("/login", auth.LoginHandler)
	r.Post("/register", auth.RegisterHandler)

	service.SetServices(r, config, cache)

	log.Default().Println("Starting server and listening on 3333")
	if err := http.ListenAndServe(":3333", r); err != nil {
		log.Fatalf("error in starting server: %v", err)
	}
}
