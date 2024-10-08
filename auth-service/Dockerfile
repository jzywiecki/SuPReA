FROM golang:1.22.5 as builder

WORKDIR /auth-service

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service ./cmd

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /auth-service

COPY --from=builder /auth-service .

EXPOSE 3333

CMD ["./auth-service"]
