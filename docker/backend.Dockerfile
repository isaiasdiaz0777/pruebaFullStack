FROM php:8.2-cli-alpine

# 1. Instalar dependencias del sistema y extensiones de PHP necesarias para PDF
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    icu-dev \
    oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql mbstring intl

# 2. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 3. Copiar archivos del proyecto
COPY ./backend/laravel .

# 4. Instalar dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# 5. Permisos críticos para que Laravel funcione en la nube
RUN chmod -R 777 storage bootstrap/cache

# 6. Comando de inicio usando el servidor interno de PHP
# Esto evita el error de MPM de Apache por completo
CMD php artisan serve --host=0.0.0.0 --port=$PORT