FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp and postgresql
RUN apk add --no-cache python3 make g++ postgresql-client

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies and source code
RUN npm prune --production && \
    rm -rf src test *.md *.json tsconfig*.json && \
    rm -rf node_modules/@types

# # Create non-root user
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nestjs -u 1001

# # Change ownership to non-root user
# RUN chown -R nestjs:nodejs /app
# USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]
