import default_args from "./args";
const { Keys } = require("casper-js-sdk");
const fs = require("fs");

// generator entry point
function generate(suffix: string, max_attempts: number){
    let attempts = 0;
    let is_running = true;
    while (is_running){
        // generate new keypair
        const k = Keys.Ed25519.new();
        // check if public key ends with suffix
        if (k.publicKey.toHex().endsWith(suffix)){
            let private_key = k.exportPrivateKeyInPem();
            // export private key as pem for use with signer / wallet
            fs.writeFile('output.pem', private_key, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                  console.error(err);
                }
            });
            console.log("YAY! Key found: ", k.publicKey.toHex());
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
    const charSetSize = 16;
    const length = suffix.length;
    let prob = 1/charSetSize;
    for (let i = 1; i < suffix.length; i ++){
        prob *= 1/charSetSize;
    }
    return 1/prob
}

// estimate time for generating N keys
function estimateTime(attempts: number, suffix: string){
    const start_time: number = Date.now();
    for (let i = 0; i < attempts; i++){
        const k = Keys.Ed25519.new();
        const x = k.publicKey.toHex().endsWith(suffix);
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
    const _estimateAttempts = estimateAttempts(suffix);
    const _estimateTime = estimateTimeSingle(10000, suffix);
    const _expectedRuntime = _estimateTime * _estimateAttempts;
    return {
        "time": _expectedRuntime,
        "attempts": _estimateAttempts
    };
}

// entry point to generate a key
function entryPoint(){
    let args = default_args();
    let publicSuffix = args['publicSuffix'];
    let generatorLimit = args['generatorLimit'];
    let action = args['entryPoint'];
    if (action == 'generate'){
        generate(publicSuffix, generatorLimit);
    }
    else if (action == 'estimate'){
        let estimation = estimate(generatorLimit, publicSuffix);
        let estimationTimeInHours = estimation.time / 1000 / 60 / 60;
        console.log(`To generate a Public Key that ends with "${publicSuffix}" will take an est. of ${estimation.attempts} attempts and ${estimationTimeInHours} hours on your machine! Only run the generator if this sound feasible.`);
    }
}

entryPoint();