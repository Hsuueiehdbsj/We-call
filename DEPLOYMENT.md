# Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker
- Docker Compose

#### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd wecall
```

2. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost
- Backend: http://localhost:8000

4. **View logs**
```bash
docker-compose logs -f
```

5. **Stop the application**
```bash
docker-compose down
```

---

### Option 2: Manual Deployment

#### Backend Deployment

**On Ubuntu/Debian:**

1. **Install Python 3.8+**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

2. **Setup application**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Create systemd service**
```bash
sudo nano /etc/systemd/system/wecall-backend.service
```

Add:
```ini
[Unit]
Description=WeCall Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/wecall/backend
Environment="PATH=/path/to/wecall/backend/venv/bin"
ExecStart=/path/to/wecall/backend/venv/bin/python run.py
Restart=always

[Install]
WantedBy=multi-user.target
```

4. **Start service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable wecall-backend
sudo systemctl start wecall-backend
```

#### Frontend Deployment

**Build the frontend:**
```bash
cd frontend
npm install
npm run build
```

**Serve with Nginx:**

1. **Install Nginx**
```bash
sudo apt install nginx
```

2. **Create Nginx configuration**
```bash
sudo nano /etc/nginx/sites-available/wecall
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/wecall/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

3. **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/wecall /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 3: Cloud Platform Deployment

#### Deploy to Heroku

**Backend:**
1. Create `Procfile`:
```
web: python run.py
```

2. Deploy:
```bash
heroku create wecall-backend
git push heroku main
```

**Frontend:**
1. Add `serve` to dependencies:
```bash
npm install serve
```

2. Update `package.json`:
```json
{
  "scripts": {
    "start": "serve -s dist -l $PORT"
  }
}
```

3. Deploy:
```bash
heroku create wecall-frontend
git push heroku main
```

#### Deploy to Railway

1. Create `railway.toml`:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python run.py"
```

2. Push to Railway via GitHub integration

#### Deploy to DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build commands:
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install && npm run build`
3. Configure run commands:
   - Backend: `python run.py`
   - Frontend: Built static site

---

## 🔒 Production Configuration

### Environment Variables

**Backend (.env):**
```env
HOST=0.0.0.0
PORT=8000
DEBUG=False
CORS_ORIGINS=https://yourdomain.com
MAX_PARTICIPANTS_PER_ROOM=10
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
```

### SSL/TLS Setup (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 📊 Monitoring

### Setup Logging

**Backend logging configuration:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/wecall/backend.log'),
        logging.StreamHandler()
    ]
)
```

### Monitor with systemd

```bash
# View backend logs
sudo journalctl -u wecall-backend -f

# Check status
sudo systemctl status wecall-backend
```

### Application Monitoring

Consider adding:
- **Sentry**: Error tracking
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **New Relic**: APM

---

## 🔄 Updates and Maintenance

### Update Application

**Docker:**
```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

**Manual:**
```bash
# Backend
cd backend
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart wecall-backend

# Frontend
cd frontend
git pull
npm install
npm run build
```

### Database Backup (if added later)

```bash
# Backup
pg_dump -U postgres wecall > backup.sql

# Restore
psql -U postgres wecall < backup.sql
```

---

## 🧪 Health Checks

Add health check endpoint monitoring:

```bash
# Check backend health
curl http://localhost:8000/health

# Monitor with cron
*/5 * * * * curl -f http://localhost:8000/health || systemctl restart wecall-backend
```

---

## 📈 Performance Optimization

### Backend Optimization
1. Use **Gunicorn** with multiple workers:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

2. Enable **gzip compression** in FastAPI

3. Add **rate limiting**

### Frontend Optimization
1. **CDN** for static assets
2. **Image optimization**
3. **Code splitting**
4. **Lazy loading**

### Network Optimization
1. Use **TURN servers** for better connectivity
2. Configure **STUN servers** closer to users
3. Implement **QoS** for media streams

---

## 🛡️ Security Checklist

- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Implement authentication (if needed)
- [ ] Enable security headers
- [ ] Setup firewall rules
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Implement logging
- [ ] Add CAPTCHA for room creation

---

## 📱 Mobile Deployment

### Progressive Web App (PWA)

Add to `frontend/public/manifest.json`:
```json
{
  "name": "WeCall",
  "short_name": "WeCall",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0ea5e9",
  "background_color": "#111827"
}
```

---

## 🌍 Multi-Region Deployment

For global users:

1. **Deploy in multiple regions**
   - AWS: us-east-1, eu-west-1, ap-southeast-1
   - Use Route53 for geographic routing

2. **Use CDN**
   - CloudFront, Cloudflare, or Fastly
   - Cache static assets globally

3. **Optimize STUN/TURN**
   - Deploy TURN servers in each region
   - Use geographic DNS for optimal routing

---

## 💰 Cost Optimization

### Free Tier Options
- **Backend**: Railway, Render, Fly.io (limited)
- **Frontend**: Netlify, Vercel, Cloudflare Pages
- **Database**: Supabase, PlanetScale (if needed)

### Paid Options (Scalable)
- **AWS**: EC2 + S3 + CloudFront
- **DigitalOcean**: Droplets + Spaces
- **Google Cloud**: Compute Engine + Cloud Storage

---

## 🎓 Production Readiness Checklist

### Before Going Live
- [ ] Run security audit
- [ ] Load testing completed
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] SSL certificates configured
- [ ] Environment variables secured
- [ ] Rate limiting implemented
- [ ] Error tracking enabled
- [ ] Documentation updated
- [ ] Team trained on deployment

### Post-Launch
- [ ] Monitor error rates
- [ ] Track user feedback
- [ ] Optimize based on metrics
- [ ] Regular security updates
- [ ] Performance monitoring
- [ ] Backup verification

---

**For assistance, consult the main README or reach out to the development team!**
