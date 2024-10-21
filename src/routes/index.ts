import { getCountriesAndCitiesInfo, getHomePage } from "@controllers";
import { checkToken } from "@middlewares";
import { Request, response, Response, Router } from "express";
import passport from "passport";

let router: Router = Router();
// router.get("/*", checkToken);
router.get("/", getHomePage.getRegister);
router.post("/", getHomePage.postInfo);

// router.get("/verify", getHomePage.getVerifyPage);
router.post("/verify-user",checkToken, getHomePage.getCode);
router.get("/verify-user", checkToken, getHomePage.getVerifyPage);

router.get("/menu", checkToken, getHomePage.getMenuPage);

router.get("/countries", checkToken, getCountriesAndCitiesInfo.getPage);
router.get("/city-edit/:id", checkToken, getCountriesAndCitiesInfo.getEditCity);
router.get(
  "/country-edit/:id",
  checkToken,
  getCountriesAndCitiesInfo.getEditCountry
);
router.post("/city-edit/:id", checkToken, getCountriesAndCitiesInfo.editDate);

router.post(
  "/country-edit/:id",
  checkToken,
  getCountriesAndCitiesInfo.editCountry
);

router.get(
  "/cities/delete/:id",
  checkToken,
  getCountriesAndCitiesInfo.deleteCity
);
router.get(
  "/countries/delete/:id",
  checkToken,
  getCountriesAndCitiesInfo.deleteCountry
);

router.get("/add-country", checkToken, getCountriesAndCitiesInfo.getAddCountry);
router.post("/add-country", checkToken, getCountriesAndCitiesInfo.addCountry);

router.get("/add-city/:id", checkToken, getCountriesAndCitiesInfo.getAddCity);
router.post("/add-city/:id", checkToken, getCountriesAndCitiesInfo.addCity);

// google
router.get(
  "/auth/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);



export default router;
