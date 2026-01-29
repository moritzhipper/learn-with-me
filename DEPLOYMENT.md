# Deployment

## Context

Stack is running on ubuntu server
Nginx as reverse proxy and rate limiter

## How it works

- builds frontend and backend in github action
- syncs docker.compose and nginx server
- syncs build output via rsync with server
- check for new db migration on backend startup, applies it if exists
