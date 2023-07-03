const express = require('express')
const router = express.Router()
const axios = require('axios')
let CODING_KEY = ''
let API_URL = ''
try{
  const SERVER_CONFIG = require('./../server')
  CODING_KEY = SERVER_CONFIG.CODING_KEY
  API_URL = SERVER_CONFIG.API_URL
}catch(err){
  console.log('未发现服务配置文件server.js\n请参照readme生成')
  process.exit(1)
}
/**
 * @description 获取团队项目列表
 * @api /hwg/findProject/projectList
 * @param {Number} pageSize
 * @param {Number} pageIndex
 * @param {String} projectName
 */
router.get('/projectList', (req, res, next) => {
  const pageSize = Number(req.query.pageSize) || 20
  const pageIndex = Number(req.query.pageIndex) || 1
  const projectName = req.query.projectName || ''
  const key = req.query.keyWord || ''
  axios({
    method: 'post',
    url: API_URL,
    headers: { 'Authorization': `token ${CODING_KEY}`, 'Content-Type': 'application/json' },
    data: { ProjectName: projectName, PageNumber: pageIndex, PageSize: pageSize, Action: 'DescribeCodingProjects' }
  }).then(result => {
    res.send({
      code: 1,
      data: result.data.Response,
      message: null
    })
  }).catch(err => {
    res.send({
      code: 3,
      data: err,
      message: null
    })
  })
})

/**
 * @description 获取项目下仓库信息列表
 * @api /hwg/findProject/getDepotInfo
 * @param {Number} ProjectId
 */
router.get('/getDepotInfo', (req, res, next) => {
  const projectId = Number(req.query.projectId)
  axios({
    method: 'post',
    url: API_URL,
    headers: { 'Authorization': `token ${CODING_KEY}`, 'Content-Type': 'application/json' },
    data: { ProjectId: projectId, Action: 'DescribeProjectDepotInfoList' }
  }).then(result => {
    res.send({
      code: 1,
      data: result.data.Response,
      message: null
    })
  }).catch(err => {
    res.send({
      code: 3,
      data: err,
      message: null
    })
  })
})

/**
 * @description 获取仓库查询分支信息列表
 * @api /hwg/findProject/getBranchInfo
 * @param {Number} depotId
 * @param {String} keyWord
 */
router.get('/getBranchInfo', (req, res, next) => {
  const depotId = Number(req.query.depotId)
  const keyWord = req.query.keyWord
  const pageIndex = Number(req.query.pageIndex) || 1
  const pageSize = Number(req.query.pageSize) || 20
  axios({
    method: 'post',
    url: API_URL,
    headers: { 'Authorization': `token ${CODING_KEY}`, 'Content-Type': 'application/json' },
    data: { DepotId: depotId, Action: 'DescribeGitBranches', keyWord: keyWord, PageNumber: pageIndex, PageSize: pageSize }
  }).then(result => {
    res.send({
      code: 1,
      data: result.data.Response,
      message: null
    })
  }).catch(err => {
    res.send({
      code: 3,
      data: err,
      message: null
    })
  })
})

/**
 * 查找某仓库的最近提交记录
 * @api /hwg/findProject/commitList
 * @param {Number} pageIndex
 * @param {Number} pageSize
 * @param {Number} depotId 仓库id
 * @param {String} ref 分支名称
 */
router.get('/commitList', (req, res, next) => {
  axios({
    method: 'post',
    url: API_URL,
    headers: { 'Authorization': `token ${CODING_KEY}`, 'Content-Type': 'application/json' },
    data: {
      Action: 'DescribeGitCommits',
      Ref: req.query.ref,
      DepotId: Number(req.query.depotId),
      PageNumber: Number(req.query.pageIndex),
      PageSize: Number(req.query.pageSize),
      StartDate: '',
      EndDate: ''
    }
  }).then(result => {
    res.send({
      code: 1,
      data: result.data.Response,
      message: null
    })
  }).catch(err => {
    res.send({
      code: 3,
      data: err,
      message: null
    })
  })
})
module.exports = router