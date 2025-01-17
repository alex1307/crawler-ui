# README: Configuring SSL Certificates, Nginx, and Renewal

This document outlines the steps we followed to configure SSL certificates using Certbot, set up Nginx, and automate certificate renewal.

---

## **1. Install Certbot and Prepare the Environment**

### **Install Certbot**

Use `snap` to install Certbot (recommended):

```bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

Or use `apt` (alternative):

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### **Clean Up Previous Certificates**

If there were issues with previous certificates, clean up old files:

```bash
sudo rm -rf /etc/letsencrypt
sudo rm -rf /var/log/letsencrypt
sudo rm -rf /var/lib/letsencrypt
```

---

## **2. Configure Nginx**

### **Temporary HTTP Configuration**

Update Nginx to temporarily serve HTTP only:

1. Open the Nginx configuration for your site:

   ```bash
   sudo nano /etc/nginx/sites-available/ehomeho.com
   ```

2. Set up HTTP-only configuration:

   ```nginx
   server {
       listen 80;
       server_name ehomeho.com www.ehomeho.com;

       location / {
           root /var/www/ehomeho;
           index index.html;
       }
   }
   ```

3. Test and reload Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## **3. Issue SSL Certificates**

### **Generate SSL Certificates**

Run Certbot to issue certificates for your domain:

```bash
sudo certbot --nginx -d ehomeho.com -d www.ehomeho.com
```

Certbot will:

- Validate your domain using HTTP.
- Generate certificates and automatically configure Nginx for SSL.

### **Check the Certificate**

Verify that the certificate was issued correctly:

```bash
openssl s_client -connect ehomeho.com:443
```

Look for the `Verify return code: 0 (ok)` and the correct `Not After` date.

---

## **4. Configure SSL in Nginx**

1. Open the Nginx configuration:

   ```bash
   sudo nano /etc/nginx/sites-available/ehomeho.com
   ```

2. Set up SSL configuration:

   ```nginx
   server {
       listen 443 ssl http2;
       server_name ehomeho.com www.ehomeho.com;

       ssl_certificate /etc/letsencrypt/live/ehomeho.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/ehomeho.com/privkey.pem;
       include /etc/letsencrypt/options-ssl-nginx.conf;
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

       location / {
           root /var/www/ehomeho;
           index index.html;
       }

       location /api/ {
           rewrite ^/api(/.*)$ $1 break;
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_http_version 1.1;
           proxy_set_header Connection "keep-alive";
       }
   }

   server {
       listen 80;
       server_name ehomeho.com www.ehomeho.com;
       return 301 https://$host$request_uri;
   }
   ```

3. Test and reload Nginx:

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## **5. Automate Certificate Renewal**

### **Set Up Automatic Renewal**

Ensure Certbot automatically renews certificates:

```bash
sudo certbot renew --deploy-hook "sudo systemctl reload nginx"
```

### **Test Renewal**

Simulate the renewal process to ensure it works:

```bash
sudo certbot renew --dry-run
```

---

## **6. Troubleshooting**

### **Check Logs**

- Nginx Access Logs:

  ```bash
  tail -f /var/log/nginx/access.log
  ```

- Nginx Error Logs:

  ```bash
  tail -f /var/log/nginx/error.log
  ```

- Certbot Logs:

  ```bash
  sudo less /var/log/letsencrypt/letsencrypt.log
  ```

### **Force Renewal**

To forcefully renew certificates:

```bash
sudo certbot renew --force-renewal
```

---

## **Conclusion**

Your Nginx server is now configured with SSL certificates managed by Certbot, and automatic renewal is in place. For any issues, refer to the troubleshooting section or logs.

