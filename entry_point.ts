import { LIMIT_MULTIPLIER } from "./constants";
import default_args from "./args";
import { estimate } from "./estimates";
import { generate } from "./generator";
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
        console.log(`\n To generate a Public Key that ends with "${publicSuffix}" will take an average of
        ${estimation.attempts} attempts and ${estimationTimeInHours} hours (or ${estimation.time} ms) on your machine!
        \n Ok!: If this sounds feasible, run $ts-node entry_point.ts -ep generate -suffix ${publicSuffix} -limit ${estimation.attempts * LIMIT_MULTIPLIER} \n`);
    }
}

entryPoint();