MAIN_PACKAGE_PATH := ./cmd
BINARY_NAME := auth-service

# .PHONY: tidy audit test tests_w_coverage build run

tidy:
	go fmt ./...
	go mod tidy -v

audit:
	go mod verify
	go vet ./...
	go run honnef.co/go/tools/cmd/staticcheck@latest -checks=all,-ST1000,-U1000 ./...
	go run golang.org/x/vuln/cmd/govulncheck@latest ./...
	go test -race -buildvcs -vet=off ./...

test:
	go test -v -race -buildvcs ./...

tests_w_coverage:
	go test -v -race -buildvcs -coverprofile=/tmp/coverage.out ./...
	go tool cover -html=/tmp/coverage.out

build: 
	go build -o ${BINARY_NAME} ${MAIN_PACKAGE_PATH}

run: build
	./${BINARY_NAME}

clean:
	rm ${BINARY_NAME} 