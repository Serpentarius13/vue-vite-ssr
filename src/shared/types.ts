import { Request } from "express";

export type AnyObject = Record<string, unknown>;

export type Manifest = Record<string, string[]>;

export type SSRContext = {
  req: Request;
};
