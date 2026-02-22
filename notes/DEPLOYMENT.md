# Deployment

## Context

Stack is running on ubuntu server
Nginx as reverse proxy and rate limiter

## How it works

- builds frontend and backend in github action
- syncs docker.compose and nginx server
- syncs build output via rsync with server
- check for new db migration on backend startup, applies it if exists
- when migration fails -> rollback
- create db backup on db migration?

## rsync options

- **`-c` (Checksum):** Forces `rsync` to compare file _content_ rather than timestamps. This ensures files are updated even if the build time changes (crucial for CI/CD).
- **`--delete`:** **Destructive.** Deletes files on the server that do not exist in your source folders (mirrors the folders exactly).
- **`-r` (Recursive):** Copies all subdirectories and files inside them.
- **`-z` (Compression):** Compresses data during transfer to make the deployment faster.
- **`-i` (Itemize):** Prints a code in the logs explaining exactly _why_ a specific file was updated (e.g., checksum mismatch, missing file).
- **`-l` (Links):** Preserves symbolic links as links (instead of copying the file they point to).
- **`-go` (Group/Owner):** Attempts to preserve the group and owner settings of the files.
- **`-D` (Devices):** Preserves device files (standard boilerplate, rarely affects web apps).
- **`-v` (Verbose):** Increases the detail in your log output.
