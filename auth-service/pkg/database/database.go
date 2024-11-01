package database

import (
	"context"
	"log"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var (
	DatabaseUrl string
)

var lock = &sync.Mutex{}
var clientInstance *mongo.Client

type Database interface {
	ConnectDbClient()
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Panic("could not load env file")
	}

	DatabaseUrl = os.Getenv("MONGODB_URL")
}

func connectDBClient() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(DatabaseUrl))
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, readpref.Primary())

	if err != nil {
		log.Fatal(err)
	}
	log.Default().Println("connected to database")

	return client
}

func GetCollection(client *mongo.Client, dbName string, collectionName string) *mongo.Collection {
	return client.Database(dbName).Collection(collectionName)
}

func disconnect(client *mongo.Client) {
	err := client.Disconnect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	log.Default().Println("disconnected from database")
}

func GetDatabaseConnection() *mongo.Client {
	if clientInstance == nil {
		lock.Lock()
		defer lock.Unlock()
		if clientInstance == nil {
			clientInstance = connectDBClient()
		}
	}

	return clientInstance
}

func CloseDatabaseConnection() {
	if clientInstance != nil {
		lock.Lock()
		defer lock.Unlock()
		disconnect(clientInstance)
		clientInstance = nil
	}
}
