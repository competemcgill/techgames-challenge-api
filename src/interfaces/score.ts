export interface IScore {
    liveness: boolean;
    indexArticles: boolean;
    showArticles200: boolean;
    showArticles400: boolean;
    showArticles404: boolean;
    createArticles200: boolean;
    createArticles400: boolean;
    updateArticles200: boolean;
    updateArticles400: boolean;
    updateArticles404: boolean;
    deleteArticles200: boolean;
    deleteArticles400: boolean;
    deleteArticles404: boolean;
    timestamp: string;
}