import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
let client = new PrismaClient();
import axios from "axios";
import { createClient } from "redis";

export class getCountriesAndCitiesInfo {
  static async getPage(req: Request, res: Response, next: NextFunction) {
    const redis = createClient();
    await redis.connect();

    try {
      let cachedData = await redis.get("fakeData12");

      let countries;
      let cities;

      if (cachedData) {
        countries = await client.countries.findMany();
        cities = await client.city.findMany();
      } else {
        let fakeData = axios.get("https://restcountries.com/v3.1/all");

        // Store the fetched data in Redis with an expiration of 10 seconds
        await redis.setEx(
          "fakeData12",
          10,
          JSON.stringify((await fakeData).data)
        );

        countries = await client.countries.findMany();
        cities = await client.city.findMany();
      }

      res.render("./homepage/index", { countries, cities });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getEditCity(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numericId = Number(id);

    try {
      res.render("./editing/index", { numericId });
    } catch (error) {
      console.error("Error fetching data:", error);
      next(error); // Pass the error to the next middleware
    }
  }
  static async getEditCountry(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const numericId = Number(id);

    try {
      res.render("./editing/country", { numericId });
    } catch (error) {
      console.error("Error fetching data:", error);
      next(error); // Pass the error to the next middleware
    }
  }

  static async editDate(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;

    let numericId = Number(id);
    interface ICity {
      name: string;
      population: number;
      regions_count?: number;
      city?: string;
      country?: string;
    }

    let { name, population, regions_count }: ICity = req.body;

    population = Number(population);
    regions_count = Number(regions_count);

    await client.city.update({
      data: <any>{
        name,
        population,
        regions_count,
      },
      where: {
        id: numericId,
      },
    });
    res.redirect("/countries");
  }

  static async deleteCity(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let numericId = Number(id);

    await client.city.delete({
      where: {
        id: numericId,
      },
    });

    res.redirect("/countries");
  }

  static async editCountry(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;

    let numericId = Number(id);
    interface ICity {
      name: string;
      population: number;
      regions_count?: number;
    }

    let { name, population, regions_count }: ICity = req.body;

    population = Number(population);
    regions_count = Number(regions_count);

    await client.countries.update({
      data: {
        name,

        population,
      },
      where: {
        id: numericId,
      },
    });
    res.redirect("/countries");
  }

  static async deleteCountry(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let numericId = Number(id);

    await client.countries.delete({
      where: {
        id: numericId,
      },
    });

    res.redirect("/countries");
  }

  static async getAddCountry(req: Request, res: Response, next: NextFunction) {
    res.render("./editing/add");
  }
  static async addCountry(req: Request, res: Response, next: NextFunction) {
    let { name, population } = req.body;

    await client.countries.create({
      data: {
        name,
        population,
      },
    });

    res.redirect("/countries");
  }

  static async getAddCity(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let numericId = Number(id);

    let country = await client.countries.findFirst({
      where: {
        id: numericId,
      },
    });
    res.render("./editing/addCity", { country });
  }
  static async addCity(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let numericId = Number(id);
    let { name, population, regions_count } = req.body;

    let nPopulation = Number(population);
    let nRegions_Count = Number(regions_count);

    await client.city.create({
      data: {
        name,
        population: nPopulation,
        regions_count: nRegions_Count,
        countryId: numericId,
      },
    });

    res.redirect("/countries");
  }
}
