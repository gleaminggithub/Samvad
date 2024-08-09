const Token =require("../models/videoTokenModel");


module.exports.getToken = async (req, res, next) => {
    try {
      console.log("Working");
      const availableTokens = await Token.find({ isAvaiable: true });
    //   console.log('Available Tokens:', availableTokens);
      
      return res.status(200).send({ availableTokens });
    } catch (err) {
      console.error('Error fetching tokens:', err);
      next(err);
    }
  };
module.exports.bookedtoken = async (req, res, next) => {
    try {
        const hash = process.env.API_KEY;
        console.log("hashValue",hash);
        const token = await Token.findByIdAndUpdate(req.params.id, {isAvaiable:false}, {new: true});
        console.log(token);
        return res.status(200).send({token,hash});
    } catch (err) {
        console.log(err);
        next(err);
    }
}

module.exports.resetToken = async (req, res, next) => {
    try {
        const {_id} =req.body;
        // console.log(typeof userid);
        const token = await Token.findByIdAndUpdate(_id, {isAvaiable:true}, {new: true});
        return res.status(200).send(token);
    } catch (err) {
        console.log(err);
        next(err);
    }
}
