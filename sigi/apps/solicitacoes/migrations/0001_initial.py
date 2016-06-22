# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-16 16:34
from __future__ import absolute_import
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        (u'usuarios', u'__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name=u'Sistema',
            fields=[
                (u'id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name=u'ID')),
                (u'sigla', models.CharField(max_length=10, verbose_name=u'Sigla')),
                (u'nome', models.CharField(max_length=100, verbose_name=u'Nome Sistema')),
                (u'descricao', models.TextField(blank=True, null=True, verbose_name=u'Descrição')),
            ],
            options={
                u'verbose_name_plural': u'Sistemas',
                u'verbose_name': u'Sistema',
            },
        ),
        migrations.CreateModel(
            name=u'Solicitacao',
            fields=[
                (u'id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name=u'ID')),
                (u'codigo', models.PositiveIntegerField(unique=True)),
                (u'titulo', models.CharField(max_length=100, verbose_name=u'Título')),
                (u'resumo', models.CharField(max_length=50, verbose_name=u'Resumo')),
                (u'casa_legislativa', models.CharField(max_length=200, verbose_name=u'Casa Legislativa')),
                (u'email_contato', models.EmailField(blank=True, max_length=254, null=True, verbose_name=u'Email de contato')),
                (u'telefone_contato', models.CharField(blank=True, max_length=15, null=True, verbose_name=u'Telefone de contato')),
                (u'data_criacao', models.DateTimeField(auto_now_add=True, verbose_name=u'Data de criação')),
                (u'descricao', models.TextField(blank=True, null=True, verbose_name=u'Descrição')),
                (u'sistema', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=u'solicitacoes.Sistema')),
                (u'usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=u'usuarios.Usuario')),
            ],
            options={
                u'ordering': [u'data_criacao'],
                u'verbose_name_plural': u'Solicitações de Novos Serviços',
                u'verbose_name': u'Solicitação de Novo Serviço',
            },
        ),
    ]