package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Service struct {
	URL string `mapstructure:"url"`
}

// Config struct holds the configuration for the application
// RateLimitWindow and RateLimitCount are the rate limit configuration
// To avoid being flooded with requests
type Config struct {
	RateLimitTimeWindow time.Duration      `mapstructure:"rateLimitTimeWindow"`
	RateLimitCount      int                `mapstructure:"rateLimitCount"`
	Services            map[string]Service `mapstructure:"services"`
}

func LoadConfig(configName string, configType string, configPath string) (*Config, error) {
	viper.SetConfigName(configName)
	viper.SetConfigType(configType)
	viper.AddConfigPath(configPath)

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("error in reading config file %s", configName)
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("error unmarshaling config: %w", err)
	}

	return &config, nil
}
