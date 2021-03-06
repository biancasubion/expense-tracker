var EmployeeCostCentre = require('../models/EmployeeCostCentre');

const findAll = async (req,res,next) => {
  let limits;
  try {
    limits = await EmployeeCostCentre.findAll();
    req.limits = limits;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const findAllByEmployee = async (req,res,next) => {
  let limits;
  try {
    limits = await EmployeeCostCentre.findAllByEmployee(req.user);
    req.limits = limits;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const findAllWithParams = async (req,res,next) => {
  let limits;
  try {
    limits = await EmployeeCostCentre.findAllWithParams(req.query);
    req.limits = limits;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const findEligible = async (req,res,next) => {
  let limits;
  try {
    limits = await EmployeeCostCentre.findForwardManagers(req.body.cost_centre_id, req.body.claim_amount);
    req.limits = limits;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const updateOne = async (req,res,next) => {
  let limit;
  try {
    const { employee_id, cost_centre_id, approval_limit } = req.body;
    limit = await EmployeeCostCentre.updateOne(employee_id, cost_centre_id, approval_limit);
    req.limit = limit;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const findAllCostCentres = async (req, res, next) => {
  let cost_centres;
  try {
    cost_centres = await EmployeeCostCentre.findAllCostCentres();
    req.cost_centres = cost_centres;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

const addOne = async (req,res,next) => {
  let limit;
  try {
    limit = await EmployeeCostCentre.addOne(req.body);
    req.limit = limit;
    next()
  } catch (err) {
    req.error = err.code;
    next();
  }
}

const revokeOne = async (req,res,next) => {
  let limit;
  try {
    const { employee_id, cost_centre_id } = req.body;
    limit = await EmployeeCostCentre.revokeOne(employee_id, cost_centre_id);
    req.limit = limit;
    next()
  } catch (err) {
    req.error = err;
    next();
  }
}

module.exports = {
  findAll: findAll,
  findAllByEmployee: findAllByEmployee,
  findEligible: findEligible,
  addOne: addOne,
  updateOne: updateOne,
  revokeOne: revokeOne,
  findAllWithParams: findAllWithParams,
  findAllCostCentres: findAllCostCentres
}