export const doGet = () => {
  let router = new router(e.pathInfo.split('/'), "GET")
  return ContentService.createTextOutput(router.route());
};
