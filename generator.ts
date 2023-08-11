const { Keys } = require("casper-js-sdk");
const fs = require("fs");

// generator entry point
export function generate(suffix: string, max_attempts: number){
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