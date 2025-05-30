# Use official Golang image as base
FROM golang:1.24.2

# Set the working directory inside container
WORKDIR /app

# Copy go.mod and go.sum first, for dependency caching
COPY go.mod go.sum ./
RUN go mod download

# Copy rest of the app
COPY . .

# Build the Go app
RUN go build -o chatapp .

# Expose the app port
EXPOSE 8000

CMD ["./chatapp"]