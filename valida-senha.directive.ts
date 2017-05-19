import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidaSenha), multi: true }]
})

export class ValidaSenha implements Validator {
    constructor(@Attribute('validateEqual') public validateEqual: string,
    @Attribute('reverse') public reverse: string) {
    }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // recebe o valor
        let v = c.value;
        // e - controla o valor
        let e = c.root.get(this.validateEqual);
        // if senha diferente de confirma senha
        if (e && v !== e.value && !this.isReverse) {
            return {
                validateEqual: false
            }
        }
        // QUando a senha for atualizada
        if (e && v === e.value && this.isReverse) {
            delete e.errors['validateEqual'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }
        // Valores diferentes e senha alterada
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({ validateEqual: false });
        }
        return null;
    }
}
