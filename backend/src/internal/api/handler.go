package api

import (
	"backend/internal/api/models/address"
	"backend/internal/api/models/censusgeocoder"
	"backend/internal/api/models/council"
	"backend/internal/api/models/geo"
	"backend/internal/api/models/record"
	"net/http"
	"path"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

func (store *Store) NewHandler() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(newCorsHandler())

	r.Post("/council", council.NewHandler(path.Join(store.Directory, "citycouncil.json")))
	r.Post("/geo", geo.NewHandler(path.Join(store.Directory, "geodistricts.json"), path.Join(store.Directory, "geonpus.json")))
	r.Post("/geocoder", censusgeocoder.NewHandler(store.GeocoderSubmitter))
	r.Post("/address", address.NewHandler(store.AddressSubmitter))
	r.Post("/record", record.NewHandler(store.RecordSubmitter))

	return r
}

func newCorsHandler() func(http.Handler) http.Handler {
	options := cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}

	cors := cors.New(options)
	return cors.Handler
}
