export default function middleware1(req, res, next) {
    console.log('middleware 1');
    return next();
}