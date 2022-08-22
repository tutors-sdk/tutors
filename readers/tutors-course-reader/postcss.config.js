module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
    purge: {
      options: {
        safelist: [
          /data-theme$/,
        ],
      },
    },
}
