export const environment = {
  production: true,
  serverPort: '3000',
  serverDomain: 'localhost',
  get serverOrigin() {
    return `http://${this.serverDomain}:${this.serverPort}`;
  },
};
