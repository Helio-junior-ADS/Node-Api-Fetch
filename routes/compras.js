var express = require("express");
var router = express.Router();
var cielo = require("../lib/cielo");


/* Post criação de compra */
router.post("/", function (req, res, next) {

  cielo.compra(req.body).then((result)=> {
    const paymentId = result.Payment.PaymentId;
    cielo.captura(paymentId)
    .then((result)=> {
      if(result.Status == 2){
        res.status(201).send({
          "Status": "Sucess",
          "Message": "Compra realizada com sucesso.",
          "CompraId": paymentId
        });
      }
      else {
        res.status(402).send({
          "Status": "Falhou",
          "Message": "Compra não realizada, problema na combraça do cartão de credito."
        });
      } 
    })
    .catch((err)=>{
      console.error(err);
    })
  });
  
});

/* Get status de compra */
router.get("/:compra_id/status", function (req, res, next) {
 cielo.consulta(req.params.compra_id)
 .then((result) => {
   
  let message = {}

  switch(result.Payment.Status) {
  case 1:
    message = {
      'Status': "Pagamento autorizado."
    };
    break;
  case 2:
    message = {
      'Status': "Pagamento realizado."
    };
    break;
  case 12:
    message = {
      'Status': "Pagamento Pendente."
    };
    break;
  default: 
    message = {
      'Status': "Pagamento Falhou."
    };
}
  res.send(message);

 });
});

module.exports = router;
