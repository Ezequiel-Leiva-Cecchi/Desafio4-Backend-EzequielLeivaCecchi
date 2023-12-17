import { Router } from 'express';

const viewsRouters = (io, productos) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.render('home', { productos });
  });

  router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', { productos });
  });

  return router;
};

export default viewsRouters;