FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /app

COPY ["src/Cronolink.API/Cronolink.API.csproj", "src/Cronolink.API/"]
COPY ["src/Cronolink.Core/Cronolink.Core.csproj", "src/Cronolink.Core/"]

RUN dotnet restore "src/Cronolink.API/Cronolink.API.csproj"

COPY src/ ./src/

WORKDIR /app/src/Cronolink.API
RUN dotnet publish "Cronolink.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS final
WORKDIR /app

EXPOSE 8080
EXPOSE 8081

COPY --from=build /app/publish .

USER $APP_UID

ENTRYPOINT ["dotnet", "Cronolink.API.dll"]