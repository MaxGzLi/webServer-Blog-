var express = require('express');
var router = express.Router();
const { getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog')
const {SuccessModle, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
router.get('/list', (req, res, next)=>{
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''
  if(req.query.isadmin){
      if(req.session.username == null){
        res.json(
          new ErrorModel('未登陆')
        ) 
      }     
      anthor = req.session.username
  }
    
  const result = getList(author,keyword)
  return result.then(listdata =>{
    res.json(
      new SuccessModle(listdata)
    ) 
  }
  )})
  

router.get('/detail', (req, res, next)=>{
    const result = getDetail(id)
    return result.then(data =>{
      res.json(new SuccessModle(data)) 
    })
  }
)

router.post('/new', loginCheck, (req,res,next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data =>{
    res.json(new SuccessModle(data))
  }
  )
})

router.post('/update',loginCheck,(req,res,next) => {
  const result = updateBlog(req.query.id, req.body)
        result.then (val =>{
            if(val){
              res.json(new SuccessModle)
            }
            else{
              res.json(new ErrorModel())
            }
        })
})


router.post('/del',loginCheck,(req,res,next) =>{
        const author = req.session.username
        const result = delBlog(req.query.id,author)
        return result.then(val =>{
            if(val){
                res.json(new SuccessModle()) 
            }
            else{
                res.json(new ErrorModel('删除博客失败'))
            }})
})
module.exports = router;
