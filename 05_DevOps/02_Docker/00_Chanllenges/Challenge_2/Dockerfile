# Base image
FROM fedora

# Install Apache HTTP server
RUN dnf -y install httpd

# Copy web content into the container
ADD webserver.tar.gz /var/www/html/

# Expose port 80 for HTTP traffic
EXPOSE 80

# Set the entrypoint to Apache httpd
ENTRYPOINT ["/usr/sbin/httpd"]

# Default arguments passed to entrypoint
CMD ["-D", "FOREGROUND"]


# to run the image use : 
# docker build -t challenge:2 .

# docker run --name fedora_1 -p 8080:80 challenge:2
