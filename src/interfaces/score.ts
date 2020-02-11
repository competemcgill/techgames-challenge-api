export interface IScore {
    liveness: boolean;
    authenticate200: boolean;
    authenticate403: boolean;
    createAccount201: boolean;
    createAccount400: boolean;
    createAccount500: boolean;
    indexArticles: boolean;
    showArticles200: boolean;
    showArticles404: boolean;
    createArticles201: boolean;
    createArticles400: boolean;
    createArticles403: boolean;
    updateArticles200: boolean;
    updateArticles400: boolean;
    updateArticles401: boolean;
    updateArticles403: boolean;
    updateArticles404: boolean;
    deleteArticles200: boolean;
    deleteArticles401: boolean;
    deleteArticles403: boolean;
    deleteArticles404: boolean;
    timestamp: string;
}