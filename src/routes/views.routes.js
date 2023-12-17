import { Router } from 'express';

const viewsRouters = (io, productos) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.render('home', { productos });
  });

  router.get('/realtimeproducts', (req, res) => {
    res.render('index', { productos });
  });

  return router;
};

export default viewsRouters;