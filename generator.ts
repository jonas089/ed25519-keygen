import default_args from "./args";
const { Keys } = require("casper-js-sdk");
import { LIMIT_MULTIPLIER } from "./constants";
const fs = require("fs");

// generator entry point
function generate(suffix: string, max_attempts: number){
    let attempts: number = 0;
    let is_running: boolean = true;
    const start_time: number = Date.now();
    console.log(`Started generating at unix ${start_time}...`);
    while (is_running){
        // generate new keypair
        const k: any = Keys.Ed25519.new();
        // check if public key ends with suffix
        if (k.publicKey.toHex().endsWith(suffix)){
            let private_key: string = k.exportPrivateKeyInPem();
            // export private key as pem for use with signer / wallet
            fs.writeFile('output.pem', private_key, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                  console.error(err);
                }
            });
            console.log("YAY! Key found: ", k.publicKey.toHex());
            console.log("Elapsed time (ms): ", Date.now() - start_time);
            // exit
            is_running = false;
        }
        attempts += 1;
        if (attempts >= max_attempts){
            // stop generating
            console.log("BOO! Failed to generate Key, exceeded limit: ", attempts);
            // exit
            is_running = false;
        }
    }
}

// estimate how many attempts are needed to produce a pubkey with suffix
function estimateAttempts(suffix: string){
    const charSetSize: number = 16;
    const length: number = suffix.length;
    let prob: number = 1/charSetSize;
    for (let i: number = 1; i < suffix.length; i ++){
        prob *= 1/charSetSize;
    }
    return 1/prob
}

// estimate time for generating N keys
function estimateTime(attempts: number, suffix: string){
    const start_time: number = Date.now();
    for (let i: number = 0; i < attempts; i++){
        const k: any = Keys.Ed25519.new();
        const x: string = k.publicKey.toHex().endsWith(suffix);
    }
    let elapsed_time: number = Date.now() - start_time;
    return elapsed_time
}

// estimate time for generating one key
function estimateTimeSingle(attempts: number, suffix:string){
    let total_time: number = estimateTime(attempts, suffix);
    return total_time / attempts;
}

// estimation entry point
function estimate(attempts: number, suffix: string){
    const _estimateAttempts: any = estimateAttempts(suffix);
    const _estimateTime: number = estimateTimeSingle(attempts, suffix);
    const _expectedRuntime: number = _estimateTime * _estimateAttempts;
    return {
        "time": _expectedRuntime,
        "attempts": _estimateAttempts
    };
}

// entry point to generate a key
function entryPoint(){
    let args: any = default_args();
    let publicSuffix: string = args['publicSuffix'];
    let generatorLimit: number = args['generatorLimit'];
    let action: string = args['entryPoint'];
    // check suffix validity
    const valid: string = "0123456789abcdef";
    for (const letter of publicSuffix){
        if (!valid.includes(letter)){
            console.log("Invalid input, only HEX is accepted!");
            return;
        }
    }

    if (action == 'generate'){
        generate(publicSuffix, generatorLimit);
    }
    else if (action == 'estimate'){
        let estimation: any = estimate(generatorLimit, publicSuffix);
        let estimationTimeInHours: number = estimation.time / 1000 / 60 / 60;
        console.log(`\n To generate a Public Key that ends with "${publicSuffix}" will take an average of ${estimation.attempts} attempts and ${estimationTimeInHours} hours (or ${estimation.time} ms) on your machine! \n Ok!: If this sounds feasible, run $ts-node generator.ts -ep generate -suffix ${publicSuffix} -limit ${estimation.attempts * LIMIT_MULTIPLIER} \n`);
    }
}

entryPoint();