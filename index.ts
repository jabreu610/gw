import createCli from "cac";
import { $ } from "bun";

const cli = createCli("gwt");
cli
  .command("ls", "placeholder command, lists current working directory files")
  .action(async () => {
    await $`ls`;
  });

cli.help();
cli.version("0.0.0");
cli.parse();
