# Use the official ASP.NET Core image
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY Backend/*.csproj ./
RUN dotnet restore

# Copy the remaining source code and build the application
COPY Backend/. ./
RUN dotnet publish -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "YourBackendAppName.dll"]
