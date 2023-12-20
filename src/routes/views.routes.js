import { Router } from 'express';


const viewsRouters = (io, productos) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.render('home.handlebars', { productos });
  });

  router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts.handlebars', { productos });
  });

  return router;
};

export default viewsRouters;