const program = require("commander");

export default function default_args() {
    program
        .option('-suffix, --public-suffix <string>', 'Suffix of desired "rare" publickey', '00')
        .option('-limit, --generator-limit <number>', 'Limit of attempts for the generator', 10000)
        .option('-ep, --entry-point <string>', 'Action to be performed (e.g. estimate, generate)', 'estimate')
        .parse(process.argv);
    var args = program.opts();
    return args;
}
