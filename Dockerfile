FROM node:14

WORKDIR /app

EXPOSE 3000

CMD ["./entrypoint.sh"]