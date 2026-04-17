# --------------------- Frontend Build ---------------------
FROM node:24 AS frontend

WORKDIR /WORDS_AND_DICE/frontend

# Copy and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build React app
RUN npm run build


# --------------------- Backend Build ---------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build

WORKDIR /WORDS_AND_DICE

# Copy csproj and restore dependencies
COPY backend/*.csproj ./backend/
RUN dotnet restore ./backend

# Copy everything else
COPY backend/. ./backend/

# Build and Publish
RUN dotnet publish ./backend -c Release -o /out


# --------------------- Runtime Build ---------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0.103

WORKDIR /WORDS_AND_DICE

# Copy backend build
COPY --from=backend-build /out .

# Copy React build into wwwroot
COPY --from=frontend /app/frontend/dist ./wwwroot

# Expose port (Render sets PORT env var)
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Run the app
ENTRYPOINT ["dotnet", "backend.dll"]