from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Transaction


def home(request):
    return render(request, "index.html")




@csrf_exempt
def add_transaction(request):
    if request.method == "POST":
        data = json.loads(request.body)

        transaction = Transaction.objects.create(
            description=data["description"],
            amount=data["amount"],
            type=data["type"],
        )

        return JsonResponse({
            "id": transaction.id,
            "description": transaction.description,
            "amount": str(transaction.amount),
            "type": transaction.type,
        })
        
def get_transactions(request):
    if request.method == "GET":
        transactions = Transaction.objects.all().order_by("-created_at")

        data = []

        for transaction in transactions:
            data.append({
                "id": transaction.id,
                "description": transaction.description,
                "amount": str(transaction.amount),
                "type": transaction.type,
            })

        return JsonResponse(data, safe=False)
    
@csrf_exempt
def delete_transaction(request, pk):
    if request.method == "DELETE":
        try:
            transaction = Transaction.objects.get(pk=pk)
            transaction.delete()

            return JsonResponse({
                "message": "Transaction deleted successfully"
            })

        except Transaction.DoesNotExist:
            return JsonResponse(
                {"error": "Transaction not found"},
                status=404
            )

    return JsonResponse(
        {"error": "Only DELETE method is allowed"},
        status=405
    )
    
@csrf_exempt
def update_transaction(request, pk):
    if request.method == "PUT":
        try:
            transaction = Transaction.objects.get(pk=pk)
            data = json.loads(request.body)

            transaction.description = data["description"]
            transaction.amount = data["amount"]
            transaction.type = data["type"]

            transaction.save()

            return JsonResponse({
                "id": transaction.id,
                "description": transaction.description,
                "amount": str(transaction.amount),
                "type": transaction.type,
            })

        except Transaction.DoesNotExist:
            return JsonResponse(
                {"error": "Transaction not found"},
                status=404
            )