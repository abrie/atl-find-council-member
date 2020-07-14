package geo

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	"backend/internal/api/logger"

	"github.com/paulmach/go.geojson"
)

type Request struct {
	Dataset string `json:"dataset"`
}

type Result struct {
	Data  *geojson.FeatureCollection `json:"data,omitempty"`
	Error string                     `json:"error,omitempty"`
}

type Data struct {
	Districts *geojson.FeatureCollection
}

func NewData(districtsPath, npusPath string) (*Data, error) {
	districtsBytes, err := ioutil.ReadFile(districtsPath)
	if err != nil {
		log.Fatalf("Failed to open council data file: %v", err)
	}

	districts, err := geojson.UnmarshalFeatureCollection(districtsBytes)
	if err != nil {
		return nil, fmt.Errorf("Failed to unmarshal districts feature collection: %v", err)
	}

	return &Data{Districts: districts}, nil
}

func ParseRequest(reader io.Reader) (*Request, error) {
	if reader == nil {
		return nil, fmt.Errorf("Request Missing Body.")
	}

	var request Request
	if err := json.NewDecoder(reader).Decode(&request); err != nil {
		return nil, fmt.Errorf("Failed to parse request.")
	}

	return &request, nil
}

func (data *Data) Submit(request *Request) (*Result, error) {
	if request.Dataset == "districts" {
		return &Result{Data: data.Districts}, nil
	}

	return &Result{Error: fmt.Sprintf("Found no dataset corresponding to '%s'.", request.Dataset)}, nil
}

func WriteResponse(w http.ResponseWriter, result *Result) {
	if body, err := json.Marshal(result); err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	} else {
		http.Error(w, "Failed to marshal Geo result", http.StatusInternalServerError)
	}
}

func NewHandler(districtsPath, npusPath string) http.HandlerFunc {
	data, err := NewData(districtsPath, npusPath)
	if err != nil {
		log.Fatal("Failed to open council data source.")
	}

	return func(w http.ResponseWriter, r *http.Request) {
		logger.DumpRequest(r)
		request, err := ParseRequest(r.Body)
		if err != nil {
			http.Error(w, "Council request failed.", http.StatusBadRequest)
			return
		}

		result, err := data.Submit(request)
		if err != nil {
			http.Error(w, "Council request failed.", http.StatusInternalServerError)
			return
		}

		if result != nil {
			WriteResponse(w, result)
		} else {
			http.Error(w, "Found nothing corresponding to that district key.", http.StatusNotFound)
		}
	}
}
