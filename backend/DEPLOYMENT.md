# Deployment runbook — ZyberHero backend

This file describes exact commands and two safe deployment workflows for the Spring Boot backend Docker image described in this repository.

Server details you provided:
- SSH: root@77.68.24.254

High-level options (pick one):

1) Build locally, push image to a registry (Docker Hub / private registry), then pull+run on the server.
   - Best when you want a fast deploy and don't want to build on the server.

2) Build on the server from the repository (git clone + `docker compose up --build -d`).
   - Useful when you don't want to push images to a registry or registry access is restricted.

Security note
- Do not store secrets (DB passwords, API keys) inside images. Provide them via environment variables, `.env` or docker secrets.
- If your server is accessible publicly, use a firewall and only open required ports.

Prerequisites (on server)
- A modern Linux distribution (Ubuntu 22.04+ or CentOS 8+ or similar)
- SSH access as root (you already have `ssh root@77.68.24.254`)
- At least Docker and Docker Compose v2 installed (commands below).

Server setup (run as root over SSH)

Debian/Ubuntu (one-liner):
```bash
# update, install docker and docker-compose plugin
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
# allow docker without sudo (optional)
usermod -aG docker root || true
systemctl enable --now docker
```

RHEL/CentOS (one-liner):
```bash
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl enable --now docker
```

Verify Docker is running:
```bash
docker version
docker compose version
```

Option A — Build locally, push to registry, deploy on server (recommended for CI/CD)

1) Build the image locally (on your workstation):
```powershell
# run from backend folder where Dockerfile is located
cd C:\Users\USR-LPTP-81\Desktop\ZyberHero_Keross\backend
docker build -t yourdockerhubusername/zyberhero-app:latest .
```

2) Push to Docker Hub (or your registry):
```powershell
docker login
docker push yourdockerhubusername/zyberhero-app:latest
```

3) On the server: pull and run with docker-compose

- Copy a deployment compose (sample below) to `/opt/zyberhero/docker-compose.yml` or a path you prefer.
- Example minimal production `docker-compose.deploy.yml` (on server):

```yaml
version: '3.8'
services:
  app:
    image: yourdockerhubusername/zyberhero-app:latest
    container_name: zyberhero-app
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/zyberhero
      SPRING_DATASOURCE_USERNAME: appuser
      SPRING_DATASOURCE_PASSWORD: apassword_from_secret
      SPRING_PROFILES_ACTIVE: docker
    ports:
      - "8060:8060"
    depends_on:
      - postgres
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: zyberhero
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apassword_from_secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

4) On the server run:
```bash
# Pull images and start
docker compose -f /opt/zyberhero/docker-compose.yml pull
docker compose -f /opt/zyberhero/docker-compose.yml up -d

# Check status
docker compose -f /opt/zyberhero/docker-compose.yml ps
docker logs zyberhero-app --tail 200
```

Option B — Build on the server from repository (no registry)

1) Put your repository on the server (either push to git and `git clone` or use `scp` / `rsync`). Example using git:
```bash
# on server
cd /opt
git clone https://github.com/ishagupta-keross/ZyberHero_Keross.git
cd ZyberHero_Keross/backend
```

2) Edit the local `docker-compose.yaml` if necessary: the `app.build.context` in your local compose uses a Windows absolute path. For server builds the compose file must reference relative path(s). Example change in `docker-compose.yaml`:

Before (Windows absolute path):
```yaml
app:
  build:
    context: C:\Users\USR-LPTP-81\Desktop\ZyberHero_Keross\backend
    dockerfile: Dockerfile
```

After (relative):
```yaml
app:
  build:
    context: ./backend
    dockerfile: Dockerfile
```

3) Build & run on server
```bash
cd /opt/ZyberHero_Keross
docker compose -f docker-compose.yaml up --build -d

# Check status
docker compose ps
docker logs zyberhero-app --tail 200
```

Notes, tips and troubleshooting
- If your Maven build needs access to a private Nexus during the image build, use a `settings.xml` and mount it during the build stage or configure CI to inject credentials. Example (on server) with buildkit mount:
  - Use a build arg or secrets to pass credentials safely rather than baking them into images.
- If `docker compose up` fails due to ports in use, either free the port or change the host port mapping in the compose.
- Use `docker compose logs -f` to stream logs.
- To keep the app running across reboots use a small systemd unit or `docker compose` service: `systemctl enable docker --now` is sufficient for Docker; consider creating a systemd unit that runs `docker compose -f /opt/zyberhero/docker-compose.yml up -d` on boot.

Firewall (ufw example)
```bash
ufw allow OpenSSH
ufw allow 8060/tcp    # application
ufw allow 5432/tcp    # postgres (if remote access needed)
ufw enable
```

Production considerations
- Do not expose Postgres to the public internet unless you have IP-restrictions and TLS.
- Use reverse proxy (nginx) and TLS for public endpoints. You already have an `nginx` service in your compose; configure it to front the app.
- Use a secrets manager or Docker secrets for DB credentials in production.

If you want, I can:
- Produce a ready-to-deploy `docker-compose.deploy.yml` in this repo with placeholders filled for your server.
- Generate the exact `scp` or git commands for copying files to `root@77.68.24.254`.
- Walk you through the `docker login`, `docker tag`, `docker push` steps for your Docker Hub account.

---
End of runbook
