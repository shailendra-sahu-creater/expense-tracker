from django.urls import path
from .views import home, add_transaction, get_transactions,delete_transaction, update_transaction


urlpatterns = [
    path("", home, name="home"),
    path("api/transactions/", add_transaction, name="add_transaction"),
    path("api/transactions/list/", get_transactions, name="get_transactions"),
    path(
    "api/transactions/<int:pk>/",
    delete_transaction,
    name="delete_transaction"
),
    
   path(
    "api/transactions/<int:pk>/update/",
    update_transaction,
    name="update_transaction"
),
]