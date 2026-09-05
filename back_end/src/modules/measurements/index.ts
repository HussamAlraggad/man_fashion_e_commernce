import { Module } from "@medusajs/framework/utils";

export const MEASUREMENTS_MODULE = "measurements";

class MeasurementsService {
  // Service methods will be implemented here
}

Module(MEASUREMENTS_MODULE, {
  service: MeasurementsService,
});

export class MeasurementsModule {}