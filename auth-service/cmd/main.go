package main

import (
	"auth-service/pkg/database"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	_ = r

	database.ConnectDBClient()

	// config, err := config.LoadConfig("config", "yaml", ".")

	// if err != nil {
	// 	log.Fatalf("error in reading configuration.")
	// }

	// cache := cache.New(config.RateLimitTimeWindow, time.Minute*10)

	// service.SetServices(r, config, cache)

	// log.Default().Println("Starting server and listening on 3333")
	// if err := http.ListenAndServe(":3333", r); err != nil {
	// 	log.Fatalf("error in starting server: %v", err)
	// }
}
