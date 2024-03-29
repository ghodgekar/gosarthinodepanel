import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import { AdminService } from '@/_restapi-services/admin.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;
    public role: any = null;

    constructor(private router: Router, private toastr: ToastrService, private api:AdminService) {}

    async loginByAuth({email, password}) {
        try {
            this.api.login({username:email, password:password}).subscribe(response => {
                console.log(response.data)
                localStorage.setItem('token', JSON.stringify(response.data));
                localStorage.setItem('role', response.role);
                // this.getProfile();
                this.router.navigate(['/']);
            })
            // const token = await Gatekeeper.loginByAuth(email, password);
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByAuth({email, password}) {
        try {
            const token = await Gatekeeper.registerByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByGoogle() {
        try {
            const token = await Gatekeeper.loginByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByGoogle() {
        try {
            const token = await Gatekeeper.registerByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByFacebook() {
        try {
            const token = await Gatekeeper.loginByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByFacebook() {
        try {
            const token = await Gatekeeper.registerByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async getProfile() {
        try {
            // this.user = await Gatekeeper.getProfile();
            this.user = JSON.parse(localStorage.getItem('token'));
            this.role = localStorage.getItem('role');
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('is_admin_menu');
        localStorage.removeItem('gatekeeper_token');
        this.user = null;
        this.router.navigate(['/login']);
    }

    logoutPartner() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('is_admin_menu');
        localStorage.removeItem('gatekeeper_token');
        this.user = null;
        this.router.navigate(['/login-partner']);
    }

    logoutAdmin() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('is_admin_menu');
        localStorage.removeItem('gatekeeper_token');
        this.user = null;
        this.router.navigate(['/login-admin']);
    }
}
