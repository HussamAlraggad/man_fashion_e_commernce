import { Module } from "@medusajs/framework/utils";

export const TRY_ON_MODULE = "try_on";

class TryOnService {
  // Service methods will be implemented here
}

Module(TRY_ON_MODULE, {
  service: TryOnService,
});

export class TryOnModule {}