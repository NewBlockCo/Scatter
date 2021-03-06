import Network from './Network';
import Identity from './Identity';

export default class Permission {

    constructor(){
        // Mandatory
        this.domain = '';
        this.network = '';
        this.identityHash = '';

        // Optional
        this.contractAddress = null;
        this.contract = null;
        this.action = null;
        this.checksum = null;

        this.timestamp = 0;
    }

    static placeholder(){ return new Permission(); }
    static fromJson(json){
        let p = Object.assign(this.placeholder(), json);
        if(json.hasOwnProperty('network')) p.network = Network.fromJson(json.network);
        // if(json.hasOwnProperty('identity')) p.identity = Identity.fromJson(json.identity);
        return p;
    }

    identity(keychain){
        return keychain.findIdentity(this.identityHash);
    }

    isIdentityOnly(){
        return !this.contract && !this.action
    }

    isContractAction(){
        return !this.isIdentityOnly() && this.contract.length && this.action.length
    }

    isIdentityFor(domain, network){
        return this.isIdentityOnly() && this.domain === domain && this.network.unique() === network.unique();
    }

    // TODO: There will be a problem with multiple identity permissions where an
    // TODO: identity was disabled, and another was used in it's place. Possibly if there is
    // TODO: already a permission for any identity another should not be added.
    identityIsNotDisabled(keychain){
        return !this.identity(keychain).disabled;
    }
}